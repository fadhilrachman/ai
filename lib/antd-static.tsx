"use client";

import { App } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";

let message: MessageInstance;
let notification: NotificationInstance;
let modal: ModalStaticFunctions;

const AntdStaticFunctions = () => {
  const staticFunctions = App.useApp();
  message = staticFunctions.message;
  modal = staticFunctions.modal;
  notification = staticFunctions.notification;
  return null;
};

export default AntdStaticFunctions;
export { message, modal, notification };
