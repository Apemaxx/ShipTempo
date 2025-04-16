import { useRoutes } from "react-router-dom";

interface TempoRouterProps {
  routes: any[];
}

const TempoRouter = ({ routes }: TempoRouterProps) => {
  const tempoRoutes = useRoutes(routes);
  return <>{tempoRoutes}</>;
};

export default TempoRouter;