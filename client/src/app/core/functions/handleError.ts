import { Observable, of } from "rxjs";

function handleError<T>(operation = "operation", result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    return of(result as T);
  };
}

export { handleError };
