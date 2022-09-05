interface PackageSize {
  width: number;
  length: number;
  height: number;
  weight: number;
}
interface Rating {
  originPostalCode: string;
  originCountry: string;
  destinyPostalCode: string;
  destinyCountry: string;
  discount: number;
  packageSize: PackageSize;
}
