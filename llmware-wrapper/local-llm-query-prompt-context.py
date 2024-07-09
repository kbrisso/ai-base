import sys
import time

from llmware.prompts import Prompt
import logging

logging.basicConfig(filename='logs/llmware-wrapper.log', encoding='utf-8', level=logging.ERROR)

model_name = sys.argv[1]
query = sys.argv[2]
prompt_name = sys.argv[3]
context = sys.argv[4]

prompter = Prompt().load_model(model_name)
try:
  output = prompter.prompt_main(query,
                                context=context,
                                prompt_name=prompt_name)
  llm_response = output["llm_response"].strip("\n")
except KeyError as e:
  logging.error("Unable to retrieve 'llm_response' from output due to: %s", e)
  llm_response = "Key 'llm_response' not found in output"

except Exception as e:
  logging.error("An unknown error occurred: %s", e)
  llm_response = "Unknown error"

finally:
  print(llm_response)
  sys.stdout.flush()
