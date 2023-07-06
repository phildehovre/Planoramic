import { supabase } from "../App";
import dayjs from "dayjs";
import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { backOff } from "exponential-backoff";

export async function deleteCalendarEvent(id: string, session: any) {
  try {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
      }
    ).then((data) => {
      console.log(JSON.stringify(data));
    });
  } catch (error) {
    alert("Unable to delete event at this time: " + error);
  }
}

export const deleteCalendarEvents = async (events: [], session: any) => {
  let idArray = events.map((e: { event_id: string }) => {
    return e.event_id;
  });
  for (let i = 0; i < events.length; i++) {
    await deleteCalendarEvent(idArray[i], session);
  }
};

export async function formatAndUpdateEvent(
  eventObj: {
    category: string;
    completed: boolean;
    description: string;
    position: number;
    id: string;
    type: string;
    event_id: string;
  },
  targetDate: Date,

  // ===== PASS THE USER SESSION AS SECOND PARAMETER:
  session: any
) {
  const { category, completed, description, position, id, type, event_id } =
    eventObj;

  const start = dayjs(targetDate).subtract(position, "days");
  const end = dayjs(targetDate).subtract(position, "days").add(1, "hour");

  const event = {
    summary: description,
    description: `${category} / ${type}`,
    start: {
      dateTime: start.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    id: event_id,
  };

  try {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(event),
      }
    ).then((data) => {
      return data.json();
    });
  } catch (error) {
    alert("Unable to create event at this time: " + error);
  }
}

const fetchHolidays = async (region: string, session: any) => {
  const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS =
    "holiday@group.v.calendar.google.com";
  const CALENDAR_REGION = region;
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS}/events`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export function useHolidays(region: any, session: any) {
  return useQuery(["holidays", { region }], () =>
    fetchHolidays(region, session)
  );
}

export async function postEventsToGoogle(
  events: any[],
  targetDate: Date,
  session: any
) {
  for (let i = 0; i < events.length; i++) {
    try {
      const response = await backOff(() =>
        formatAndPostEvent(events[i], events[i].position, session)
      );
      return response;
    } catch (e) {
      console.log("error: ", e);
    }
  }
}

async function formatAndPostEvent(
  eventObj: {
    category: string;
    completed: boolean;
    description: string;
    position: number;
    id: string;
    type: string;
    event_id: string;
  },
  targetDate: Date,
  session: any
) {
  const { category, completed, description, position, id, type, event_id } =
    eventObj;

  //   const start = dayjs(targetDate).subtract(position, "days");
  //   const end = dayjs(targetDate).subtract(position, "days").add(1, "hour");
  const start = dayjs(targetDate).toISOString();
  const end = dayjs(targetDate).add(1, "hour").toISOString();

  console.log(targetDate, typeof targetDate);

  const event = {
    summary: description,
    description: `${category} / ${type}`,
    start: {
      dateTime: start,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    id: event_id,
  };

  try {
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(event),
      }
    ).then((res) => {
      //   console.log(res);
      return res.json();
    });
  } catch (error) {
    alert("Unable to create event at this time: " + error);
  }
}
