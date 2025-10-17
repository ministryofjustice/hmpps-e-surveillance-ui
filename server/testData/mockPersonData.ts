import { Person, ApiResponse } from '../data/eSurveillanceClient'

export const mockPerson1: Person = {
  id: 1,
  deliusId: 'A123456',
  uniqueDeviceWearerId: 'UDW001',
  personId: 'PER001',
  givenName: 'John',
  familyName: 'Smith',
  alias: 'Johnny',
  createdAt: '2024-01-15T10:30:00Z',
  toy: false,
}

export const mockPerson2: Person = {
  id: 2,
  deliusId: 'B789012',
  uniqueDeviceWearerId: 'UDW002',
  personId: 'PER002',
  givenName: 'Jane',
  familyName: 'Doe',
  alias: 'Janie',
  createdAt: '2024-01-16T14:22:00Z',
  toy: true,
}

export const mockPersonsArray: Person[] = [mockPerson1, mockPerson2]

export const mockPersonsApiResponse: ApiResponse<Person> = {
  content: mockPersonsArray,
  totalElements: 15,
  totalPages: 3,
  size: 5,
  number: 0,
  pageable: {
    pageNumber: 0,
    pageSize: 5,
    offset: 0,
    paged: true,
    unpaged: false,
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
  },
  sort: {
    sorted: false,
    unsorted: true,
    empty: true,
  },
  first: true,
  last: false,
  numberOfElements: 2,
  empty: false,
}

export const emptyPersonsApiResponse: ApiResponse<Person> = {
  ...mockPersonsApiResponse,
  content: [],
  totalElements: 0,
  numberOfElements: 0,
  empty: true,
}

export const singlePersonApiResponse: ApiResponse<Person> = {
  ...mockPersonsApiResponse,
  content: [mockPerson1],
  totalElements: 1,
  totalPages: 1,
  numberOfElements: 1,
}
