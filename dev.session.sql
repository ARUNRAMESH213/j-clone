select categories.id,
  epics.name,
  epics.id,
  categories.epic_id,
  categories.id as category_id,
  categories.name as category_name
from epics
  left join categories on categories.epic_id = epics.id;