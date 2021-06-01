import { User } from "gql/user";

export const users: Partial<User>[] = [
  {
    id: "7efc3bc3-30d0-4923-a684-f4aaf9f692b2",
    email: "kim@dialexa.com",
    hashedPassword: "$2a$12$0dX5etNPOfGdxGpfdWWPxefwV4hS.4NOsw74yfMNSHWGfxr37x/ta",
    isEmailVerified: true,
    avatarUrl:
      "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNjkwNzI5ODIsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiU2hvNGVmTXRUVnUzdG9kTDl2T3cifQ==,signature:f2962b59b3b6372edf6b86d01091e4b66924818c46fbc731b55bc8f31550d0a5/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/Sho4efMtTVu3todL9vOw",
    displayName: "Kim K.",
    sendLineupReminders: true,
    sendScoringRecaps: true,
  },
  {
    id: "81033b59-dc3a-4e56-bfb0-2a851aaf3d58",
    email: "bryan@dialexa.com",
    hashedPassword: "$2a$12$0dX5etNPOfGdxGpfdWWPxefwV4hS.4NOsw74yfMNSHWGfxr37x/ta",
    isEmailVerified: true,
    avatarUrl:
      "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNDkyNjE1MjUsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoic2xXbUpzS1RUMTZJdlE2Q3RhbWkifQ==,signature:737b8a54f72b7ae56632b7b3285ad6d939b2526ef999c0ed9d93b451330a1b71/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/slWmJsKTT16IvQ6Ctami",
    displayName: "Bryan B.",
    sendLineupReminders: true,
    sendScoringRecaps: true,
  },
];
