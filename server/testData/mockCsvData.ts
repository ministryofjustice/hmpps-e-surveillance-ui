export const mockPersonCsvContent = `delius_id,unique_device_wearer_id,person_id,given_name,family_name,alias,created_at,toy
A123456,UDW001,PER001,John,Smith,Johnny,2024-01-15T10:30:00Z,false
B789012,UDW002,PER002,Jane,Doe,Janie,2024-01-16T14:22:00Z,true`

export const mockEventCsvContent = `person_id,event_type,timestamp,location_lat,location_lng,zone_type,violation_type
PER001,LOCATION_UPDATE,2024-01-15T22:15:00Z,51.5074,-0.1278,RESTRICTED,CURFEW_VIOLATION
PER002,ZONE_ENTRY,2024-01-16T16:45:00Z,51.5155,-0.1410,EXCLUSION,ZONE_VIOLATION`

export const mockSinglePersonCsvContent = `delius_id,unique_device_wearer_id,person_id,given_name,family_name
A123456,UDW001,PER001,John,Smith`

export const mockSingleEventCsvContent = `person_id,event_type,timestamp,violation_type
PER001,LOCATION_UPDATE,2024-01-15T22:15:00Z,CURFEW_VIOLATION`

export const mockS3SignedUrls = {
  person: 'https://s3-signed-url-person.amazonaws.com',
  event: 'https://s3-signed-url-event.amazonaws.com',
  generic: 'https://s3-signed-url.amazonaws.com',
}
