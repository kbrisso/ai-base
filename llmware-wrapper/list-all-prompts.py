from llmware.models import PromptCatalog
import logging
import json

logging.basicConfig(filename='logs/llmware-wrapper.log', encoding='utf-8', level=logging.ERROR)


def get_all_prompt_instructions():
    try:

        return PromptCatalog().get_all_prompts()

    except Exception as e:
        print("")
        logging.error(e)


if __name__ == '__main__':
    print(json.dumps(get_all_prompt_instructions()))
