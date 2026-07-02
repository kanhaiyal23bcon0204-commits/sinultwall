import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { dataService } from "./data";
import { DeviceType } from "./types";

interface Value {
  devices: DeviceType[];
  loading: boolean;
  refresh: () => void;
}

const Ctx = createContext<Value | null>(null);

export function ActiveDevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    dataService.getActiveDevices().then((d) => {
      setDevices(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <Ctx.Provider value={{ devices, loading, refresh }}>{children}</Ctx.Provider>;
}

export function useActiveDevices() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useActiveDevices must be used within ActiveDevicesProvider");
  return ctx;
}
