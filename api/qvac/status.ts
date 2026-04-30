import { getQvacStatus } from "../../server/qvac";

export default function handler(_request: any, response: any) {
  response.status(200).json(getQvacStatus());
}
