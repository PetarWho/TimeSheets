import BaseQueryParams from "./baseQueryParams";
export default interface UserQueryParams extends BaseQueryParams {
  status?: "active" | "deactivated";
}
