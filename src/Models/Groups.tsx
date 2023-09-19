import { User } from "./Users";

export interface Group {
  groupId?: string;
  groupName: string;
  gUsers?: User[];
}
