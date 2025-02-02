import type { PageServerLoad } from "./$types";
import type { CompanySalary } from "$lib/types/salary"

export const load: PageServerLoad = async ({ locals }) => {
    const loadDataPromise = new Promise<any[]>((resolve, reject) => {
      const db = locals.db;
      const query = "select * from salary";
      const stmt = db.prepare(query);
      const rows = stmt.all();

      resolve(rows);
    })

    const rows = await loadDataPromise;
    return {
      salary: rows.map((item) => ({
        company: item.company,
        level: item.levelName,
        tag: item.tagName,
        experience: `${item.yearsAtCompany} Years`,
        yearsOfExperience: `${item.yearsOfExperience} Years`,
        totalCompensation: parseFloat(item.totalCompensation) || 0,
        salary: parseFloat(item.base) || 0,
        bonus: parseFloat(item.bonus) || 0,
        stock: parseFloat(item.stock) || 0
      }) as CompanySalary)
    };
  };