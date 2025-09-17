export interface Session {
  session_id: string;
  device_id: string;
  user_agent: string;
  geo_location: string;
  ip_address: string;
  browser: string;
  os: string;
  device: string;
  device_type: string;
  last_active_at: string;
  is_current: boolean;
}

export const blankSession: Session = {
  session_id: "",
  device_id: "",
  user_agent: "",
  geo_location: "",
  ip_address: "",
  browser: "",
  os: "",
  device: "",
  device_type: "",
  last_active_at: "",
  is_current: false,
}