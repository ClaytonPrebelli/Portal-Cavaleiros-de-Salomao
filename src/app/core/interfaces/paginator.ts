export interface PaginatorInterface{
    firstItemOnPage: number,
hasNextPage: boolean,
hasPreviousPage: boolean,
isFirstPage: boolean,
isLastPage: boolean,
items : any[],
lastItemOnPage: number,
pageCount: number,
pageNumber: number,
pageSize: number,
totalItemCount:number
}