// Mock faker for Jest tests
module.exports = {
  faker: {
    string: {
      numeric: length => '123456'.substring(0, length),
    },
    helpers: {
      replaceSymbols: template => template.replace(/#/g, '1'),
    },
    person: {
      fullName: () => 'John Doe',
    },
  },
}
