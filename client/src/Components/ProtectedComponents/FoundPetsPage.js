import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
const token = localStorage.getItem("token");

function FoundPetsPage() {
  const [founds, setFounds] = useState([]);
  const [modal, setModal] = useState(false);
  const [petId, setPetId] = useState("");

  async function getAllFoundPets() {
    if (!token) {
      return;
    }
    const response = await axios.get(
      "http://localhost:8000/auth/getFoundPets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setFounds(response.data);
  }

  useEffect(() => {
    getAllFoundPets();
  }, []);

  async function SendEmail() {
    if (!token) {
      return;
    }

    await axios
      .post(
        "http://localhost:8000/auth/send_email",
        { petId: petId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("Email sent"))
      .catch(() => alert("Could not send email"));
  }

  const toggleModal = (id) => {
    setPetId(id);

    console.log(petId);
    setModal(!modal);
  };
  return (
    <>
      {founds.map((pet) => (
        <div key={pet._id}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardImage
                src={pet.photo}
                width={200}
                height={200}
                alt="pet"
                fluid
              />
              <MDBCardText>
                <i>Pets description: </i>
                {pet.description}
              </MDBCardText>
              <MDBCardText>
                <i>Pets Location: </i>
              </MDBCardText>
              <MapContainer
                center={pet.location}
                zoom={13}
                style={{ width: "250px", height: "250px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                  <Marker position={pet.location}>
                    Pet was lost somewhere here
                  </Marker>
                }
              </MapContainer>
              <MDBCardText>
                <i>Time the pet was found: </i>
                {pet.time}
              </MDBCardText>
            </MDBCardBody>
            <MDBBtn onClick={() => toggleModal(pet._id)}>That's my pet!</MDBBtn>
          </MDBCard>
        </div>
      ))}
      <MDBModal show={modal} setShow={setModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Warning</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Pressing the button will send an email to the person that found
              this pet. Before you press the button make sure you this is the
              right pet.
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>
                Close
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  SendEmail();
                  toggleModal();
                }}
              >
                Send the email
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default FoundPetsPage;
