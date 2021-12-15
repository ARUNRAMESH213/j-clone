# REST

Representational State Transfer

- Uniform interface
- Stateless
- Cacheable

URL

| Description              | Method | URL format                      |
| ------------------------ | ------ | ------------------------------- |
| get all resource         | GET    | /namespace/resources            |
| get one resource         | GET    | /namespace/resources/:id        |
| create resource          | POST   | /namespace/resources            |
| update resource          | PUT    | /namespace/resources/:id        |
| delete resource          | DELETE | /namespace/resources/:id        |
| resource specific action | ANY    | /namespace/resources/:id/action |

## Filter items by epic ID

    GET /api/v1/items?epic_id=1

## Filter items by category ID

    GET /api/v1/items?category_id=1

    GET /api/v1/categories/1/items
