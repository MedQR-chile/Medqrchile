import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function VerPublica() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo"); // fichas_individuales, fichas_familiares, fichas_institucionales
  const [ficha, setFicha] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerFicha = async () => {
      try {
        if (!tipo || !id) return;

        const docRef = doc(db, tipo, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFicha(docSnap.data());
        } else {
          setFicha(null);
        }
      } catch (error) {
        console.error("Error al obtener la ficha:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerFicha();
  }, [id, tipo]);

  if (cargando) return <p>Cargando ficha médica...</p>;
  if (!ficha) return <p>No se encontró la ficha médica.</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ficha Médica Pública</h1>
      <p><strong>Nombre:</strong> {ficha.nombre}</p>
      <p><strong>RUT:</strong> {ficha.rut}</p>
      <p><strong>Edad:</strong> {ficha.edad}</p>
      <p><strong>Grupo sanguíneo:</strong> {ficha.grupo_sanguineo}</p>
      <p><strong>Contacto de emergencia:</strong> {ficha.contacto_emergencia}</p>
      <p><strong>Antecedentes médicos:</strong> {ficha.antecedentes}</p>
      {ficha.fotoURL && (
        <img
          src={ficha.fotoURL}
          alt="Foto carnet"
          className="mt-4 w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  );
}

export default VerPublica;
