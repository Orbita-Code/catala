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
