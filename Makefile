all: dart_client javascript_client java_client

dart_client:
	env OUTPUT_LANGUAGE=dart ./script/generate-bindings.sh

javascript_client:
	env OUTPUT_LANGUAGE=javascript ./script/generate-bindings.sh

java_client:
	env OUTPUT_LANGUAGE=java ./script/generate-bindings.sh
