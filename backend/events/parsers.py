from rest_framework.parsers import MultiPartParser, DataAndFiles
import json

class NestedMultiPartParser(MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(stream, media_type=media_type, parser_context=parser_context)
        
        data = self._reconstruct_data(result.data)
        data = self._unwrap_indexed_dicts(data)

        # Merge files directly into data so DRF passes them to the serializer
        for key, file_list in result.files.lists():
            # If it's a single file
            if len(file_list) == 1:
                data[key] = file_list[0]
            else:
                data[key] = file_list

        return data  # return dict, not DataAndFiles

    def _reconstruct_data(self, flattened_data):
        nested_data = {}
        for key, value in flattened_data.items():
            parts = key.replace(']', '').split('[')
            current_level = nested_data
            for i, part in enumerate(parts):
                if i == len(parts) - 1:
                    current_level[part] = value
                else:
                    next_part = parts[i + 1]
                    is_index = next_part.isdigit()
                    if is_index:
                        index = int(next_part)
                        if part not in current_level or not isinstance(current_level[part], list):
                            current_level[part] = []
                        while len(current_level[part]) <= index:
                            current_level[part].append({})
                        current_level = current_level[part][index]
                    else:
                        if part not in current_level or not isinstance(current_level[part], dict):
                            current_level[part] = {}
                        current_level = current_level[part]
        return nested_data

    def _unwrap_indexed_dicts(self, obj):
        if isinstance(obj, list):
            if all(isinstance(item, dict) and len(item) == 1 and list(item.keys())[0].isdigit() for item in obj):
                return [self._unwrap_indexed_dicts(list(item.values())[0]) for item in obj]
            else:
                return [self._unwrap_indexed_dicts(item) for item in obj]
        elif isinstance(obj, dict):
            return {k: self._unwrap_indexed_dicts(v) for k, v in obj.items()}
        else:
            return obj