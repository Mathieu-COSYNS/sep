export {};

// TODO

// import basketReducer, { addOneProduct, removeOneProductById } from './basketSlice';

// describe('counter reducer', () => {
//   const initialState = {
//     isLoading: false,
//     data: [
//       {
//         id: 1,
//         name: 'Product 1',
//         sell_price: '5',
//       },
//       {
//         id: 2,
//         name: 'Product 2',
//         sell_price: '4',
//       },
//     ],
//   };

//   it('should handle initial state', () => {
//     expect(basketReducer(undefined, { type: 'unknown' })).toEqual({ isLoading: true });
//     expect(basketReducer(initialState, { type: 'unknown' })).toEqual(initialState);
//   });

//   it('should handle add for a new item', () => {
//     const actual = basketReducer(
//       initialState,
//       addOneProduct({
//         id: 3,
//         name: 'Product 3',
//         sell_price: '3.5',
//       })
//     );
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         ...initialState.data,
//         {
//           id: 3,
//           name: 'Product 3',
//           buy_price: '1.25',
//           sell_price: '3.5',
//           quantity: 2,
//         },
//       ],
//     });
//   });

//   it('should handle add for an existing item', () => {
//     const actual = basketReducer(
//       initialState,
//       addOneProduct({
//         id: 1,
//         name: 'Product 1',
//         sell_price: '5',
//       })
//     );
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         {
//           id: 1,
//           name: 'Product 1',
//           sell_price: '5',
//         },
//         {
//           id: 2,
//           name: 'Product 2',
//           sell_price: '4',
//         },
//       ],
//     });
//   });

//   // TODO: test addAll

//   it('should handle removeOne with item quantity equals to 1', () => {
//     const actual = basketReducer(initialState, removeItemById({ id: 1 }));
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         {
//           id: 2,
//           name: 'Product 2',
//           buy_price: '2',
//           sell_price: '4',
//           quantity: 5,
//         },
//       ],
//     });
//   });

//   it('should handle removeOne with item quantity greater than 1', () => {
//     const actual = basketReducer(initialState, removeItemById({ id: 2 }));
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         {
//           id: 1,
//           name: 'Product 1',
//           buy_price: '3.5',
//           sell_price: '5',
//           quantity: 1,
//         },
//         {
//           id: 2,
//           name: 'Product 2',
//           buy_price: '2',
//           sell_price: '4',
//           quantity: 4,
//         },
//       ],
//     });
//   });

//   it('should handle removeAll with item quantity equals to 1', () => {
//     const actual = basketReducer(initialState, removeOneProductById({ id: 1 }));
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         {
//           id: 2,
//           name: 'Product 2',
//           buy_price: '2',
//           sell_price: '4',
//           quantity: 5,
//         },
//       ],
//     });
//   });

//   it('should handle removeAll with item quantity greater than 1', () => {
//     const actual = basketReducer(initialState, removeOneProductById({ id: 2 }));
//     expect(actual).toEqual({
//       isLoading: false,
//       data: [
//         {
//           id: 1,
//           name: 'Product 1',
//           buy_price: '3.5',
//           sell_price: '5',
//           quantity: 1,
//         },
//       ],
//     });
//   });

//   it('should handle removeAll with no items at the end', () => {
//     const actual1 = basketReducer(initialState, removeOneProductById({ id: 1 }));
//     const actual2 = basketReducer(actual1, removeOneProductById({ id: 2 }));
//     expect(actual2).toEqual({
//       isLoading: false,
//       data: [],
//     });
//   });
// });
