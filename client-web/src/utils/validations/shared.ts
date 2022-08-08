export const isEmpty = (value: string) => {
    return !value || value.trim() === '';
};

export const minLength = (value: string, length: number) => {
    return value.trim().length > length;
};

export const isPhone = (phone: string) => {
    return phone.length === 17 && phone[1] === '1';
};

export const isEmail = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const isDate = (date: any) => {
    console.log(new Date(date));
    return !isNaN(Date.parse(date));
};

export const isDateAfter = (dateBefore: any, dateAfter: any) => {
    return new Date(dateBefore).getMilliseconds() < new Date(dateAfter).getMilliseconds();
};
