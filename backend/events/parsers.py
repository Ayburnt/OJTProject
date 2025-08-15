# events/parsers.py
from rest_framework.parsers import MultiPartParser

import json

def _unwrap_indexed_dicts(obj):
    """
    Recursively convert lists of dicts with integer keys to lists of dicts.
    Example: [{'0': {...}}, {'1': {...}}] -> [{...}, {...}]
    """
    if isinstance(obj, list):
        # If every item is a dict with a single integer key, unwrap
        if all(isinstance(item, dict) and len(item) == 1 and list(item.keys())[0].isdigit() for item in obj):
            return [_unwrap_indexed_dicts(list(item.values())[0]) for item in obj]
        else:
            return [_unwrap_indexed_dicts(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: _unwrap_indexed_dicts(v) for k, v in obj.items()}
    else:
        return obj

class NestedMultiPartParser(MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(stream, media_type=media_type, parser_context=parser_context)
        data = self._reconstruct_data(result.data)
        data = _unwrap_indexed_dicts(data)  # <-- Unwrap after reconstructing
        return {'data': data, 'files': result.files}

    def _reconstruct_data(self, flattened_data):
        nested_data = {}
        for key, value in flattened_data.items():
            parts = key.replace(']', '').split('[')
            current_level = nested_data
            for i, part in enumerate(parts):
                if i == len(parts) - 1:
                    # Final part of the key, assign the value
                    current_level[part] = value
                else:
                    # Not the last part, prepare for the next level
                    next_part = parts[i + 1]
                    is_index = next_part.isdigit()

                    if is_index:
                        index = int(next_part)
                        # If the key doesn't exist or is not a list, create or convert it
                        if part not in current_level or not isinstance(current_level[part], list):
                            current_level[part] = []

                        while len(current_level[part]) <= index:
                            current_level[part].append({})

                        current_level = current_level[part][index]
                    else:
                        # If the key doesn't exist or is not a dictionary, create or convert it
                        if part not in current_level or not isinstance(current_level[part], dict):
                            current_level[part] = {}

                        current_level = current_level[part]
        return nested_data