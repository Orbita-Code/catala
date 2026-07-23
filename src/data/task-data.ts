import { laClasseTasks } from "@/data/la-classe";
import { lEscolaTasks } from "@/data/l-escola";
import { elCosTasks } from "@/data/el-cos";
import { laRobaTasks } from "@/data/la-roba";
import { laCasaTasks } from "@/data/la-casa";
import { laFamiliaTasks } from "@/data/la-familia";
import { lesBotiguesTasks } from "@/data/les-botigues";
import { elMenjarTasks } from "@/data/el-menjar";
import { elsAnimalsTasks } from "@/data/els-animals";
import { laCiutatTasks } from "@/data/la-ciutat";
import { elsVehiclesTasks } from "@/data/els-vehicles";
import { elsOficisTasks } from "@/data/els-oficis";
import { Task } from "@/types/tasks";

export const taskData: Record<string, Task[]> = {
  "la-classe": laClasseTasks,
  "l-escola": lEscolaTasks,
  "el-cos": elCosTasks,
  "la-roba": laRobaTasks,
  "la-casa": laCasaTasks,
  "la-familia": laFamiliaTasks,
  "les-botigues": lesBotiguesTasks,
  "el-menjar": elMenjarTasks,
  "els-animals": elsAnimalsTasks,
  "la-ciutat": laCiutatTasks,
  "els-vehicles": elsVehiclesTasks,
  "els-oficis": elsOficisTasks,
};

export function getTaskCount(slug: string): number {
  return taskData[slug]?.length || 0;
}

export function getScoringTaskCount(slug: string): number {
  const tasks = taskData[slug];
  if (!tasks) return 0;
  return tasks.filter(t => !t.bonus).length;
}

/**
 * Count how many of the given completed task IDs are real, scoring (non-bonus)
 * tasks of this theme. Ignores the bonus activity and any stale IDs left in
 * localStorage from removed/renamed tasks — so the count can never exceed
 * getScoringTaskCount (prevents e.g. "13/12").
 */
export function getCompletedScoringCount(slug: string, completedTaskIds: string[]): number {
  const tasks = taskData[slug];
  if (!tasks || !completedTaskIds) return 0;
  const scoringIds = new Set(tasks.filter(t => !t.bonus).map(t => t.id));
  return completedTaskIds.filter(id => scoringIds.has(id)).length;
}
