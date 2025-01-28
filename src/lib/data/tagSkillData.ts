import type { TagSkill } from '../types/tagSkill';
import skillsJsonData from './skills.json';

export const tagSkills: TagSkill[] = skillsJsonData.map((item) => ({
  tag: item.tagName,
  company: item.company,
  position: item.position,
  yearsOfExperience: item.yearsOfExperience || 0,
  requiredSkills: item.requiredSkills,
  benefits: item.benefits,
  salaryRange: item.salaryRange,
}));