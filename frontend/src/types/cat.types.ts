export interface IMouse {
  id: number;
  name: string;
}

export interface ICat {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  image: string;
  mice: IMouse[];
}

export interface IPaginatedCats {
  data: ICat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICatFormData {
  firstName: string;
  lastName: string;
  description: string;
  image: string;
  mice: { name: string }[];
}

export interface ICatsFilters {
  catName: string;
  mouseName: string;
  page: number;
  limit: number;
}
