from llmware.prompts import ModelCatalog
import logging
import json

logging.basicConfig(filename='logs/llmware-wrapper.log', encoding='utf-8', level=logging.INFO)
def list_generative_local_models():
    try:
        mc = ModelCatalog().list_generative_local_models()
        return mc

    except Exception as e:
        print("")
        logging.error(e)

if __name__ == '__main__':
    print(json.dumps(list_generative_local_models()))
