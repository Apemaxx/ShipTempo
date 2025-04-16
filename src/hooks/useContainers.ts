import { useState, useEffect, useCallback } from "react";
import {
  fetchSTGContainers,
  fetchContainerDetails,
} from "@/lib/api/containers";
import { CFSLotDetail } from "@/types/api";

// Tipos
export type ShipmentType =
  | "Ocean Export"
  | "Ocean Import"
  | "Air Export"
  | "Air Import"
  | "Trucking"
  | "Customs Clearance"
  | "Warehouse Services";

export interface Shipment {
  id: string;
  type: ShipmentType;
  hbl: string;
  mbl: string;
  pieces: number;
  volume: string; // CBM
  dimensions: string;
  weight: string;
  customsClearance?: {
    status: string;
    date: string;
  };
  freightRelease?: {
    status: string;
    date: string;
  };
  lfd?: {
    status: string;
    date: string;
  };
}

export interface Container {
  id: string;
  number: string;
  type: string;
  status: string;
  location: string;
  eta: string;
  vessel: string;
  carrier: string;
  pol: string; // Port of Loading
  pod: string; // Port of Discharge
  mbl: string;
  shipments: Shipment[];
  // Additional STG fields
  jobNumber?: string;
  customerReference?: string;
  availableAtPier?: string;
  appointmentDate?: string;
  outgatedDate?: string;
  dateIn?: string;
  stripDate?: string;
  availableAtSTG?: string;
  returnEmptyDate?: string;
  goDate?: string;
  // CFS Lot Details
  cfsLotDetails?: CFSLotDetail[];
  containerAttachments?: string[];
  isLoadingDetails?: boolean;
  detailsError?: string;
}

interface UseContainersProps {
  initialData?: Container[];
}

/**
 * Hook personalizado para gestionar los contenedores y sus detalles
 */
export const useContainers = ({ initialData }: UseContainersProps = {}) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedContainers, setExpandedContainers] = useState<string[]>([]);
  const [loadedContainerDetails, setLoadedContainerDetails] = useState<
    Set<string>
  >(new Set());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  // Función para cambiar el tamaño de página
  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      currentPage: 1, // Resetear a la primera página
    }));
  }, []);

  // Función para cambiar de página
  const setCurrentPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  // Cargar contenedores iniciales
  useEffect(() => {
    const loadContainers = async () => {
      try {
        setLoading(true);

        if (initialData && initialData.length > 0) {
          // Usar datos proporcionados
          setContainers(initialData);
          setError(null);
        } else {
          // Obtener desde API
          const stgContainers = await fetchSTGContainers();

          // Transformar datos al formato de Container
          const mappedContainers = stgContainers.map((stgContainer) => {
            // Crear un envío (shipment) desde los datos del contenedor
            const shipment: Shipment = {
              id: `SHIP-${stgContainer.jobNumber}`,
              type: "Ocean Import",
              hbl: stgContainer.customerReference || "-",
              mbl: stgContainer.masterBillNumber,
              pieces: 0,
              volume: "-",
              dimensions: "-",
              weight: "-",
              customsClearance: {
                status: stgContainer.status,
                date: stgContainer.availableAtPier || "-",
              },
              freightRelease: {
                status:
                  stgContainer.status === "Available"
                    ? "Released"
                    : "Not Released",
                date: stgContainer.availableAtSTG || "-",
              },
              lfd: {
                status: stgContainer.goDate ? "Set" : "Not Set",
                date: stgContainer.goDate || "-",
              },
            };

            return {
              id: stgContainer.id,
              number: stgContainer.containerNumber,
              type: stgContainer.type || "Unknown",
              status: stgContainer.status,
              location: stgContainer.location,
              eta: stgContainer.vesselETA,
              vessel: stgContainer.vesselName,
              carrier: stgContainer.carrier || "Unknown",
              pol: stgContainer.pol || "Unknown",
              pod: stgContainer.pod || "Unknown",
              mbl: stgContainer.masterBillNumber,
              jobNumber: stgContainer.jobNumber,
              customerReference: stgContainer.customerReference,
              availableAtPier: stgContainer.availableAtPier,
              appointmentDate: stgContainer.appointmentDate,
              outgatedDate: stgContainer.outgatedDate,
              dateIn: stgContainer.dateIn,
              stripDate: stgContainer.stripDate,
              availableAtSTG: stgContainer.availableAtSTG,
              returnEmptyDate: stgContainer.returnEmptyDate,
              goDate: stgContainer.goDate,
              shipments: [shipment],
            };
          });

          setContainers(mappedContainers);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading container data:", err);
        setError("Failed to load container data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadContainers();
  }, [initialData]);

  // Obtener detalles del contenedor utilizando la función API centralizada
  const fetchContainerDetailsFromApi = useCallback(
    async (container: Container) => {
      // Evitar cargar detalles ya cargados
      if (loadedContainerDetails.has(container.id)) {
        return;
      }

      try {
        // Actualizar contenedor para mostrar estado de carga
        setContainers((prev) =>
          prev.map((c) =>
            c.id === container.id
              ? { ...c, isLoadingDetails: true, detailsError: undefined }
              : c
          )
        );

        // Solo hacer la petición si tenemos un número de contenedor
        if (container.number) {
          // Usar la función centralizada de la API
          const response = await fetchContainerDetails(container.number);

          // Actualizar contenedor con los detalles obtenidos
          setContainers((prev) =>
            prev.map((c) =>
              c.id === container.id
                ? {
                    ...c,
                    cfsLotDetails: response?.cfsLotDetails || [],
                    containerAttachments: response?.containerAttachments || [],
                    isLoadingDetails: false,
                    detailsError: undefined,
                  }
                : c
            )
          );

          // Marcar este contenedor como ya cargado
          setLoadedContainerDetails((prev) => new Set(prev).add(container.id));
        }
      } catch (error) {
        console.error(
          `Error fetching details for container ${container.number}:`,
          error
        );

        // Actualizar contenedor para mostrar error
        setContainers((prev) =>
          prev.map((c) =>
            c.id === container.id
              ? {
                  ...c,
                  isLoadingDetails: false,
                  detailsError:
                    "Failed to load container details. Please try again.",
                }
              : c
          )
        );
      }
    },
    [loadedContainerDetails]
  );

  // Alternar visibilidad del contenedor (expandir/contraer)
  const toggleContainer = useCallback(
    (containerId: string) => {
      const isExpanding = !expandedContainers.includes(containerId);

      // Actualizar estado de contenedores expandidos
      setExpandedContainers((prev) =>
        prev.includes(containerId)
          ? prev.filter((id) => id !== containerId)
          : [...prev, containerId]
      );

      // Si estamos expandiendo y no hemos cargado los detalles, obtenerlos
      if (isExpanding) {
        const container = containers.find((c) => c.id === containerId);
        if (container && !loadedContainerDetails.has(containerId)) {
          fetchContainerDetailsFromApi(container);
        }
      }
    },
    [
      containers,
      expandedContainers,
      fetchContainerDetailsFromApi,
      loadedContainerDetails,
    ]
  );

  return {
    // Estado
    containers,
    loading,
    error,
    expandedContainers,
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(containers.length / pagination.pageSize),
      totalItems: containers.length,
    },

    // Acciones
    toggleContainer,
    fetchContainerDetails: fetchContainerDetailsFromApi,
    setPageSize,
    setCurrentPage,

    // Helpers
    paginatedContainers: containers.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    ),
    isContainerExpanded: (containerId: string) =>
      expandedContainers.includes(containerId),
  };
};

export default useContainers;
