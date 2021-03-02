import { Resolver } from "type-graphql";

import { SeasonWeek } from "./schema";

@Resolver(SeasonWeek)
class SeasonWeekResolver {}

export default SeasonWeekResolver;
