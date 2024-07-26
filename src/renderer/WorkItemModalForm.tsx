import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import logger from './Logger';

type WorkItem = {
  id?: number;
  modelName: string;
  promptName: string;
  queryText: string;
  responseText: string;
  contextText: string;
  notesText: string;
};

type Props = {
  showWorkItemModal: boolean;
  modelName: string;
  promptName: string;
  contextText: string;
  responseText: string;
  queryText: string;
  showContext: boolean;
  closeCreateWorkItemModal: any;
};

async function createWorkItem(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  try {
    const responseText = event.currentTarget.elements.namedItem(
      'responseText',
    ) as HTMLInputElement;

    const modelName = event.currentTarget.elements.namedItem(
      'modelName',
    ) as HTMLInputElement;

    const promptName = event.currentTarget.elements.namedItem(
      'promptName',
    ) as HTMLInputElement;

    const contextText = event.currentTarget.elements.namedItem(
      'contextText',
    ) as HTMLInputElement;

    const notesText = event.currentTarget.elements.namedItem(
      'notesText',
    ) as HTMLInputElement;

    const queryText = event.currentTarget.elements.namedItem(
      'queryText',
    ) as HTMLInputElement;

    const workItem: WorkItem = {
      modelName: modelName.value,
      promptName: promptName.value,
      queryText: queryText.value,
      responseText: responseText.value,
      contextText: contextText != null ? contextText.value : '',
      notesText: notesText.value,
    };
    await window.electron.pyRenderer.insertWorkItem(workItem);
  } catch (error) {
    logger([error, 'error']);
  }
}
function WorkItemModalForm({
  closeCreateWorkItemModal,
  contextText,
  modelName,
  promptName,
  queryText,
  responseText,
  showContext,
  showWorkItemModal,
}: Props) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      event.preventDefault();
    } catch (error) {
      logger([error, 'error']);
    }
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
    }
    await createWorkItem(event);
  }
  return (
    <div>
      <Modal
        centered
        size="lg"
        animation={false}
        show={showWorkItemModal}
        onHide={() => closeCreateWorkItemModal()}
      >
        <form
          className="bg-light border rounded border-secondary shadow-lg"
          onSubmit={(e) => {
            handleSubmit(e);
            closeCreateWorkItemModal();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Work Item</Modal.Title>
          </Modal.Header>
          <Modal.Body className="container-fluid">
            <span className="badge bg-light text-dark">Model name</span>
            <div className="form-group mb-3">
              <input
                readOnly
                className="form-control"
                type="text"
                name="modelName"
                id="modelName"
                value={modelName}
              />
            </div>
            <span className="badge bg-light text-dark">Prompt name</span>
            <div className="form-group mb-3">
              <input
                readOnly
                className="form-control"
                type="text"
                id="promptName"
                name="promptName"
                defaultValue={promptName}
              />
            </div>
            <span className="badge bg-light text-dark">Response</span>
            <div className="form-group mb-3">
              <Form.Control
                readOnly
                as="textarea"
                name="responseText"
                id="responseText"
                rows={8}
                className="form-control"
                placeholder=""
                aria-label=""
                aria-describedby="button-addon2"
                defaultValue={responseText}
              />
            </div>
            {showContext ? (
              <>
                <span className="badge bg-light text-dark">Context</span>
                <div className="form-group mb-3">
                  <Form.Control
                    readOnly
                    as="textarea"
                    rows={4}
                    name="contextText"
                    id="contextText"
                    className="form-control"
                    defaultValue={contextText}
                    maxLength={2048}
                    minLength={1}
                    placeholder=""
                    aria-label=""
                    aria-describedby="button-addon2"
                  />
                </div>
              </>
            ) : null}
            <span className="badge bg-light text-dark">Query</span>
            <div className="form-group mb-3">
              <Form.Control
                readOnly
                as="textarea"
                rows={4}
                id="queryText"
                defaultValue={queryText}
                name="queryText"
                className="form-control"
                maxLength={240}
                minLength={1}
                aria-label=""
                aria-describedby="button-addon2"
              />
            </div>
            <span className="badge bg-light text-dark">Notes</span>
            <div className="form-group mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                id="notesText"
                name="notesText"
                className="form-control"
                maxLength={240}
                minLength={1}
                aria-label=""
                aria-describedby="button-addon2"
                onChange={() => handleChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="btn btn-secondary"
              onClick={closeCreateWorkItemModal}
            >
              Close
            </Button>
            <Button variant="btn btn-secondary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default WorkItemModalForm;
