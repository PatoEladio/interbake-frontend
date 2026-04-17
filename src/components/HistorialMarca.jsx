import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, Portal, Flex, Spinner, Text, Stack, Grid
} from "@chakra-ui/react";
import { historialMarcas } from "../services/marcas";
import toast from "react-hot-toast";

export default function HistorialMarca({ isOpen, onClose, marcaId }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && marcaId) {
      cargarHistorial();
    } else {
      setHistorial([]);
    }
  }, [isOpen, marcaId]);

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const data = await historialMarcas(marcaId);
      setHistorial(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar historial");
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEstado = (estadoId) => {
    return (
      <Box
        w="14px"
        h="14px"
        borderRadius="50%"
        bg={estadoId === 1 ? "#4caf50" : estadoId === 2 ? "#f44336" : estadoId === 3 ? "#ffc107" : "#bdbdbd"}
        display="inline-block"
        boxShadow="0 0 4px rgba(0,0,0,0.2)"
      />
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose(); }} size="xl">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Historial de Auditoría (Marca #{marcaId})</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {loading ? (
                <Flex justify="center" align="center" py={10}>
                  <Spinner size="xl" color="blue.500" />
                </Flex>
              ) : historial.length > 0 ? (
                <Box maxH="400px" overflowY="auto" pr={2}>
                  <Stack gap={4}>
                    {historial.map((h, idx) => (
                      <Box key={h.correlativo || idx} borderWidth="1px" borderRadius="md" p={4} bg="white" shadow="sm">
                        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Correlativo</Text>
                            <Text fontSize="sm">{h.correlativo}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Num Ficha</Text>
                            <Text fontSize="sm">{h.num_ficha || "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Fecha Marca</Text>
                            <Text fontSize="sm">{h.fecha_marca ? h.fecha_marca.split('T')[0].split(' ')[0] : "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Hora Marca</Text>
                            <Text fontSize="sm">{h.hora_marca || "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Evento</Text>
                            <Text fontSize="sm">{h.evento === 1 ? "Entrada" : h.evento === 2 ? "Salida" : "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Hashcode</Text>
                            <Text fontSize="sm" title={h.hashcode} isTruncated maxW="150px">{h.hashcode || "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Fecha Actualización</Text>
                            <Text fontSize="sm">{h.fecha_actualizacion || "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Autor Modificación</Text>
                            <Text fontSize="sm">{h.usuario_actualizador || "-"}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500">Estado</Text>
                            <Flex align="center" gap={2}>
                              {renderEstado(h.estado || h.estado_id)}
                              <Text fontSize="sm">
                                {h.estado === 1 ? "Aprobado" : h.estado === 2 ? "Rechazado" : h.estado === 3 ? "Pendiente" : "Desconocido"}
                              </Text>
                            </Flex>
                          </Box>
                          {h.comentario && (
                            <Box gridColumn={{ md: "span 3" }}>
                              <Text fontSize="xs" fontWeight="bold" color="gray.500">Comentario</Text>
                              <Text fontSize="sm">{h.comentario}</Text>
                            </Box>
                          )}
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Flex justify="center" align="center" py={10}>
                  <Text color="gray.500">No hay registros de auditoría para esta marca.</Text>
                </Flex>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
