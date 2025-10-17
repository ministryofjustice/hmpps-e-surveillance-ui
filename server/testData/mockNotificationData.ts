import { Notification, ApiResponse } from '../data/eSurveillanceClient'

export const mockNotification1: Notification = {
  id: 1,
  personId: 'PER001',
  personName: 'John Smith',
  violation: 'CURFEW_VIOLATION',
  timestamp: '2024-01-15T22:15:00Z',
  message: 'Person detected outside permitted area during curfew hours',
}

export const mockNotification2: Notification = {
  id: 2,
  personId: 'PER002',
  personName: 'Jane Doe',
  violation: 'ZONE_VIOLATION',
  timestamp: '2024-01-16T16:45:00Z',
  message: 'Person entered restricted zone',
}

export const mockNotificationsArray: Notification[] = [mockNotification1, mockNotification2]

export const mockNotificationsApiResponse: ApiResponse<Notification> = {
  content: mockNotificationsArray,
  totalElements: 8,
  totalPages: 2,
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

export const emptyNotificationsApiResponse: ApiResponse<Notification> = {
  ...mockNotificationsApiResponse,
  content: [],
  totalElements: 0,
  numberOfElements: 0,
  empty: true,
}

export const singleNotificationApiResponse: ApiResponse<Notification> = {
  ...mockNotificationsApiResponse,
  content: [mockNotification1],
  totalElements: 1,
  totalPages: 1,
  numberOfElements: 1,
}
