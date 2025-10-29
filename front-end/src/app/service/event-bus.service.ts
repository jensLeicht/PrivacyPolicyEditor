import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class EventBusService {
	private subject$ = new Subject();

	constructor() {}

	emit(event: any): void {
		this.subject$.next(event);
	}

	on(eventName: string, action: any): Subscription {
		return this.subject$
			.pipe(filter((e: any) => e === eventName))
			.subscribe(action);
	}
}
