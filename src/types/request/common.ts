export interface GetListParams {
  limit?: number;
  itemsPerPage?: number;
  page?: number;
}

export interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}
