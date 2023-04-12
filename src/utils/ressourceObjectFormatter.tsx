import dayjs from "dayjs";

export const formatRessourceObjectForSubmission = (keys: string[], data: any) => {
    let eventObj: any = {};
    keys.forEach(key => {
        eventObj[key] = data[key]
    })

    return eventObj;
};