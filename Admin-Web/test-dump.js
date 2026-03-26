import fs from 'fs';
import { execSync } from 'child_process';

const logOutput = execSync('curl -sS -X GET -H "Authorization: Bearer " http://localhost:8081/api/admin/scrap-categories').toString();
