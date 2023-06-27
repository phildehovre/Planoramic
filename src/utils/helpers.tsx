import { TaskObj, TemplateObj } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export function convertDaysToUnits(position: number, unit: string) {
  if (unit === "days") {
    return position;
  }
  if (unit === "weeks") {
    return position / 7;
  }
  if (unit === "months") {
    return Math.round(position / 30.4);
  }
}

export function convertPositionToDays(position: number, unit: string) {
  if (unit === "days") {
    return position;
  }
  if (unit === "weeks") {
    return position * 7;
  }
  if (unit === "months") {
    return position * 30;
  }
}

export function convertPositionToDate(
  position: number,
  unit: string = "days_before",
  targetDate: any
) {
  let [unitType, beforeOrAfter] = unit.split("_");
  let hash: any = {
    days: "day",
    weeks: "week",
    months: "month",
  };
  let newDate;
  if (beforeOrAfter === "before") {
    newDate = dayjs(targetDate)
      .subtract(position, hash[unitType])
      .format("ddd DD-MM-YYYY");
  }
  if (beforeOrAfter === "after") {
    newDate = dayjs(targetDate)
      .add(position, hash[unitType])
      .format("ddd DD-MM-YYYY");
  }
  return newDate;
}

export function convertTemplatePositionForSorting(event: {
  position_units: string;
  position: number;
}): number {
  const hash: Record<string, number> = {
    days: 1,
    weeks: 7,
    months: 30,
  };

  const { position = 1, position_units = "days_before" } = event;
  const [unit, beforeOrAfter] = event.position_units
    ? event.position_units.split("_")
    : ["days", "before"];
  const sortingPosition =
    position * hash[unit] * (beforeOrAfter === "after" ? -1 : 1);
  return sortingPosition;
}

export function formatTemplateEventsToCampaign(
  templateEvents: TaskObj[],
  campaignId: string
) {
  const newArray = templateEvents.map((t) => {
    const {
      position,
      author_id,
      description,
      entity_responsible,
      position_units,
      template_id,
      type,
      category,
      phase_number,
      phase_name,
    } = t;

    return {
      position,
      author_id,
      description,
      entity_responsible,
      position_units,
      template_id,
      type,
      category,
      completed: false,
      campaign_id: campaignId,
      phase_number,
      phase_name,
      event_id: uuidv4().split("-").join(""),
    };
  });

  return newArray;
}

export const formatDateForUser = (value: string) => {
  const newDate = new Date(value);
  // let weekday = newDate.getDay()
  // let date = newDate.getDate()
  // let month = newDate.getMonth()
  // let year = newDate.getUTCFullYear()
  // let time = newDate.getTime()
  // return `${weekday} ${date} ${month} ${year}, ${time}`
  return newDate.toString();
};

export const formatEventDate = (
  event: { position: number },
  targetDate: any
) => {
  let formattedDate = dayjs(targetDate).subtract(event.position, "days");
  let countdown;
  if (event.position % 7 === 0) {
    if (event.position / 7 === 1) {
      countdown = "1 week";
    }
  } else if (event.position <= 7) {
    countdown = `${event.position} day(s)`;
  } else {
    countdown = `${(event.position - (event.position % 7)) / 7} week(s), ${
      event.position % 7
    } day(s)`;
  }

  return {
    ...event,
    countdown,
    position: formattedDate.format("ddd DD/MM/YYYY"),
  };
};

export const formatDaysToDaysAndWeek = (length: number) => {
  let countdown, weeks, days;
  if (length % 7 === 0) {
    if (length / 7 === 1) {
      countdown = "1 week";
    }
  } else if (length <= 7) {
    countdown = `${length} day(s)`;
  } else {
    countdown = `${(length - (length % 7)) / 7} week(s), ${length % 7} day(s)`;
  }
  return countdown;
};

export function checkFalsyValuesInEvents(
  events: { [x: string]: any }[] | null | undefined,
  keys: string[] = [
    "description",
    "entity_responsible",
    "position_units",
    "category",
    "position",
  ]
): [boolean | undefined, string[]] {
  const keysWithFalsyValues: string[] = [];

  const hasFalsyValue = events?.some((row) => {
    const falsyKeys = keys.filter((key) => !row[key]);

    keysWithFalsyValues.push(...falsyKeys);

    return falsyKeys.length > 0;
  });

  return [hasFalsyValue, keysWithFalsyValues];
}
