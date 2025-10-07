import { delete_employees, import_employees } from './import_employees';
import { delete_orgs, import_orgs } from './import_organizations';
import { delete_user, import_user } from './import_user';

if (process.argv[2] === '--import') {
    Promise.all([import_user(),import_orgs(),import_employees()]);
}
if (process.argv[2] === '--delete') {
    Promise.all([delete_employees(), delete_orgs(), delete_user()]);
}
