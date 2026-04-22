import { useState } from "react";
import {
  Box, Button, Field, Flex, Input, Grid, Select, Portal, createListCollection, Textarea
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { crearMarca } from "../services/marcas";

export default function CreateMarca({ onSuccess, onCancel, numFicha, dispositivoId }) {
  const [formData, setFormData] = useState({
    fecha_marca: "",
    hora_marca: "",
    evento: "",
    comentario: "",
    tipo_marca_id: "1" 
  });
  const [loading, setLoading] = useState(false);

  // Mocks estáticos de eventos y tipos. De ser necesario se pueden conectar a un endpoint de catálogos
  const eventosColl = createListCollection({
    items: [
      { label: "Entrada", value: "1" },
      { label: "Salida", value: "2" }
    ]
  });

  const tiposMarcaColl = createListCollection({
    items: [
      { label: "Manual (Sistema)", value: "3" },
      { label: "Huella", value: "1" },
      { label: "Rostro", value: "2" },
      { label: "Tarjeta", value: "4" }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fecha_marca || !formData.hora_marca || !formData.evento) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creando registro...");

    try {
      const payload = {
        ...formData,
        evento: parseInt(formData.evento, 10),
        tipo_marca_id: parseInt(formData.tipo_marca_id, 10),
        num_ficha: numFicha,
        dispositivo_id: dispositivoId
      };
      
      await crearMarca(payload);
      toast.success("Registro de marca creado con éxito", { id: toastId });
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Error al crear la marca", { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
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
            {eventosColl.items.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </Box>
        </Field.Root>

        <Field.Root required>
          <Field.Label>Tipo Marca</Field.Label>
          <Box 
            as="select" 
            name="tipo_marca_id"
            value={formData.tipo_marca_id} 
            onChange={handleChange}
            w="full"
            p={2}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            outline="none"
            _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
          >
            <option value="" disabled>Seleccionar tipo</option>
            {tiposMarcaColl.items.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </Box>
        </Field.Root>

        <Field.Root gridColumn={{ md: "span 2" }}>
          <Field.Label>Comentario (Opcional)</Field.Label>
          <Textarea 
            name="comentario" 
            value={formData.comentario} 
            onChange={handleChange} 
            placeholder="Motivo de la marca o detalle adicional"
          />
        </Field.Root>
      </Grid>
      
      <Flex justify="flex-end" gap={3} mt={6}>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" colorScheme="blue" bg="#eaaa00" color="white" _hover={{ bg: "#cca000" }} loading={loading}>
          Guardar Registro
        </Button>
      </Flex>
    </Box>
  );
}
