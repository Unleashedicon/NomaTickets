import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./locationpicker"), {
  ssr: false, // disables server-side rendering for this component
});

export default function LocationMapWrapper(props: {
  lat: number;
  lng: number;
  label?: string;
}) {
  return <LocationMap {...props} />;
}
