import { useSelector } from "react-redux";

export const GetDependencyLoading = () =>
  useSelector((state) => state?.allDependencies?.getDependencyloading);

export const GetAllDrivers = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.drivers);

export const AllUnits = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.units);

export const AllCustomers = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.customer);

export const StackTypes = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.stack_types);

export const ChargeTypes = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.charge_types);

export const ShipTo = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.shipTo);

export const Shipper = () =>
  useSelector((state) => state?.allDependencies?.allDependencies?.shipper);
