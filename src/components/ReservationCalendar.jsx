import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../assets/tearoom.css";

const fasceOrarie = ["Mattina", "Pomeriggio", "Sera"];

const getGiorni = () => {
  const giorni = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
    const date = d.toISOString().split("T")[0];
    giorni.push({ label, date });
  }
  return giorni;
};

const ReservationCalendar = ({ onPrenota, prenotazioni = [] }) => {
  const giorniSettimana = getGiorni();
  const [slotSelezionato, setSlotSelezionato] = useState(null);

  const isSlotOccupato = (date, timeSlot) => {
    return prenotazioni.some(
      (r) => r.date === date && r.timeSlot === timeSlot.toUpperCase()
    );
  };

  const handleSelezione = (giorno, fascia) => {
    const slot = {
      date: giorno.date,
      timeSlot: fascia.toUpperCase(),
    };
    setSlotSelezionato(slot);
    onPrenota(slot);
  };

  return (
    <Table
      bordered
      responsive
      className="reservation-calendar text-center mt-4 w-auto mx-auto"
    >
      <thead>
        <tr>
          <th></th>
          {giorniSettimana.map((g) => (
            <th key={g.date}>{g.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fasceOrarie.map((fascia) => (
          <tr key={fascia}>
            <td>{fascia}</td>
            {giorniSettimana.map((giorno) => {
              const isSelected =
                slotSelezionato &&
                slotSelezionato.date === giorno.date &&
                slotSelezionato.timeSlot === fascia.toUpperCase();

              const isOccupied = isSlotOccupato(giorno.date, fascia);

              return (
                <td key={giorno.date + fascia}>
                  <Button
                    variant={
                      isOccupied
                        ? "secondary"
                        : isSelected
                        ? "success"
                        : "outline-success"
                    }
                    size="sm"
                    disabled={isOccupied}
                    onClick={() => handleSelezione(giorno, fascia)}
                  >
                    {isOccupied ? "Occupato" : isSelected ? "✓" : "Libero"}
                  </Button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ReservationCalendar;
