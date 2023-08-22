import pandas as pd
import numpy as np

from django.db.models import Sum
from django.db.models.functions import TruncDate

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from sep_inventory.ReadWriteSerializerMixin import ReadWriteSerializerViewSet
from sep_inventory.utils import excel_response_from_df, now

from .serializers import ProductSerializer
from .serializers import PaymentMethodSerializer
from .serializers import ReadEntrySerializer
from .serializers import ReadSaleSerializer
from .serializers import ReadPackSerializer
from .serializers import WriteEntrySerializer
from .serializers import WriteSaleSerializer
from .serializers import WritePackSerializer
from .models import Entry, Pack, PaymentMethod, Product, Sale


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]


class PackViewSet(ReadWriteSerializerViewSet):
    queryset = Pack.objects.all()
    read_serializer_class = ReadPackSerializer
    write_serializer_class = WritePackSerializer
    permission_classes = [IsAuthenticated]


class EntryViewSet(ReadWriteSerializerViewSet):
    queryset = Entry.objects.filter(deleted_date__isnull=True)
    read_serializer_class = ReadEntrySerializer
    write_serializer_class = WriteEntrySerializer
    permission_classes = [IsAuthenticated]


class SaleViewSet(ReadWriteSerializerViewSet):
    queryset = Sale.objects.filter(
        deleted_date__isnull=True).prefetch_related('items', 'sale_to_product')
    read_serializer_class = ReadSaleSerializer
    write_serializer_class = WriteSaleSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sale_report(request):
    products = Product.objects.all()
    sales = Sale.objects.filter(deleted_date__isnull=True)
    product_columns = ['id', 'name', 'buy_price', 'sell_price']
    product_df = pd.DataFrame.from_records(
        products.values('id', 'name', 'buy_price', 'sell_price'),
        columns=product_columns
    )
    sales_df = pd.DataFrame.from_records(
        sales.values('items')
        .annotate(created_date=TruncDate('created_date'))
        .annotate(Sum('sale_to_product__quantity')),
        columns=['items', 'created_date', 'sale_to_product__quantity__sum']
    )

    sales_df = sales_df.pivot(index='items', columns='created_date')
    sales_df.columns = sales_df.columns.droplevel(0)
    sales_df = sales_df.reset_index()
    sales_df.rename(columns={'items': 'id'}, inplace=True)
    sales_df.fillna(0, inplace=True)

    df = pd.merge(product_df, sales_df, how='left')
    df = df[product_columns +
            [col for col in sales_df.columns if col not in product_columns]]
    df = df.T.set_index(np.concatenate((np.repeat('Products', 4),
                        np.repeat('Sales', df.shape[1] - 4))), append=True).T
    df = df.swaplevel(0, 1, 1)

    def worksheet_callback(ws):
        ws.freeze_panes = 'F3'

    return excel_response_from_df(df, f'{now()}_reports_sales.xlsx', 'reports_sales',
                                  multi_index=True,
                                  worksheet_callback=worksheet_callback)
