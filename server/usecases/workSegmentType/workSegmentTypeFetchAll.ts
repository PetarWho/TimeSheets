import WorkSegmentType from "../../entity/workSegmentType";
import { fetchAllWorkSegmentTypes } from "../../adapters/repositories/workSegmentTypeRepository";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

async function workSegmentTypeFetchAllUseCase(
  params: BaseQueryParams
): Promise<WorkSegmentType[]> {
  const allWorkSegmentTypes: WorkSegmentType[] =
    await fetchAllWorkSegmentTypes(params);
  const workSegmentTypes = allWorkSegmentTypes.map(
    (workSegmentTypesData: WorkSegmentType) =>
      new WorkSegmentType(
        workSegmentTypesData.id,
        workSegmentTypesData.name,
        workSegmentTypesData.color,
        workSegmentTypesData.description,
        workSegmentTypesData.created_at,
        workSegmentTypesData.updated_at
      )
  );
  return workSegmentTypes;
}

export default workSegmentTypeFetchAllUseCase;
