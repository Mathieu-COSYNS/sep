from rest_framework.pagination import CursorPagination


class CreatedDateCursorPagination(CursorPagination):
    page_size = 100
    ordering = '-created_date'


class MultiplePaginationMixin:
    def get_pagination_class(self):
        return self.pagination_class

    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or `None`.
        """
        if not hasattr(self, '_paginator'):
            if self.get_pagination_class() is None:
                self._paginator = None
            else:
                self._paginator = self.get_pagination_class()()
        return self._paginator
