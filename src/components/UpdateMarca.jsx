import { useState, useEffect } from "react";
import {
  Box, Button, Field, Flex, Input, Grid, Textarea, Dialog, Portal
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { actualizarMarcas } from "../services/marcas";

export default function UpdateMarca({ isOpen, onClose, marcaToEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    fecha_marca: "",
    hora_marca: "",
    evento: "",
    comentario: ""
  });
  const [loading, setLoading] = useState(false);

  const parseDateForInput = (str) => {
    if (!str) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const match = str.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (match) {
      const [_, dd, mm, yyyy] = match;
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  };

  useEffect(() => {
    if (isOpen && marcaToEdit) {
      setFormData({
        fecha_marca: parseDateForInput(marcaToEdit.fecha_marca),
        hora_marca: marcaToEdit.hora_marca || "",
        evento: mapEventoToValue(marcaToEdit.evento) || "",
        comentario: marcaToEdit.comentario || ""
      });
    } else {
      setFormData({ fecha_marca: "", hora_marca: "", evento: "", comentario: "" });
    }
  }, [isOpen, marcaToEdit]);

  const mapEventoToValue = (evtStr) => {
    if (!evtStr) return "";
    const e = evtStr.toString().toLowerCase();
    if (e.includes("entrada")) return "1";
    if (e.includes("salida")) return "2";
    return evtStr; // Si el backend envía directo el id
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fecha_marca || !formData.hora_marca || !formData.evento) {
      toast.error("Fecha, hora y evento son obligatorios");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Actualizando registro...");

    try {
      await actualizarMarcas(
        marcaToEdit.marca_id, 
        formData.fecha_marca, 
        formData.hora_marca, 
        parseInt(formData.evento, 10), 
        formData.comentario
      );
      toast.success("Registro actualizado con éxito", { id: toastId });
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Error al actualizar la marca", { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose(); }} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Editar Marca</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box as="form" id="update-marca-form" onSubmit={handleSubmit}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  
                  <Field.Root required>
                    <Field.Label>Fecha</Field.Label>
                    <Input 
                      type="date"
                      name="fecha_marca" 
                      value={formData.fecha_marca} 
                      onChange={handleChange} 
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Hora</Field.Label>
                    <Input 
                      type="time"
                      name="hora_marca" 
                      value={formData.hora_marca} 
                      onChange={handleChange} 
                      step="1"
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Evento</Field.Label>
                    <Box 
                      as="select" 
                      name="evento"
                      value={formData.evento} 
                      onChange={handleChange}
                      w="full"
                      p={2}
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      outline="none"
                      _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                    >
                      <option value="" disabled>Seleccionar evento</option>
                      <option value="1">Entrada</option>
                      <option value="2">Salida</option>
                    </Box>
                  </Field.Root>

                  <Field.Root gridColumn={{ md: "span 2" }}>
                    <Field.Label>Comentario (Opcional)</Field.Label>
                    <Textarea 
                      name="comentario" 
                      value={formData.comentario} 
                      onChange={handleChange} 
                      placeholder="Motivo de la edición o comentario"
                    />
                  </Field.Root>
                </Grid>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Flex justify="flex-end" gap={3} w="full">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" form="update-marca-form" colorScheme="blue" bg="#eaaa00" color="white" _hover={{ bg: "#cca000" }} loading={loading}>
                  Guardar Cambios
                </Button>
              </Flex>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
