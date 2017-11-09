import { TUTORIAL_CATEGORY } from '../../../common/tutorials/tutorial_category';
import { INSTRUCTION_VARIANT } from '../../../common/tutorials/instruction_variant';

export function netflowSpecProvider() {
  return {
    id: 'netflow',
    name: 'Netflow',
    category: TUTORIAL_CATEGORY.SECURITY,
    shortDescription: 'The Logstash Netflow module simplifies the collection, normalization, and visualization of network flow data',
    longDescription: 'The Logstash Netflow module simplifies the collection, normalization, and visualization of network flow data.' +
      ' With a single command, the module parses network flow data, indexes the events into Elasticsearch, and installs a suite of Kibana' +
      ' dashboards to get you exploring your data immediately. Logstash modules support Netflow Version 5 and 9.',
    //iconPath: '', TODO
    completionTimeMinutes: 10,
    //previewImagePath: 'kibana-apache.png', TODO
    params: [
      {
        'netflow.var.input.udp.port': {
          type: 'number', // TODO: Make this a const as well?
          defaultValue: 2055
        }
      }
    ],
    instructionSets: [
      {
        title: 'Getting Started',
        instructionVariants: [
          {
            id: INSTRUCTION_VARIANT.OSX,
            instructions: [
              {
                title: 'Download and install Logstash',
                textPre: 'Download and install Logstash by running the commands below.' +
                         ' Skip this step if you already have Logstash installed.' +
                         ' If you are installing Logstash for the first time, we recommend reading the [Getting Started' +
                         ' guide]({config.elastic_docs.website_url}/guide/en/logstash/{config.elastic_docs.link_version}' +
                         '/getting-started-with-logstash.html) in the online documentation.',
                commands: [
                  'curl -L -O https://artifacts.elastic.co/downloads/logstash/logstash-{config.kibana.version}.tar.gz',
                  'tar xzvf logstash-{config.kibana.version}.tar.gz'
                ]
              },
              {
                title: 'Setup the Netflow module',
                textPre: 'In the Logstash install directory, run the following command to enable the Netflow module.',
                commands: [
                  './bin/logstash --modules netflow --setup',
                ],
                textPost: '*Note:* The --setup option creates a `netflow-*` index pattern in Elasticsearch and imports' +
                  ' Kibana dashboards and visualizations. Running `--setup` is a one-time setup step. Omit this option' +
                  ' for subsequent runs of the module to avoid overwriting existing Kibana dashboards.'
              },
              {
                title: 'Start the Netflow module',
                textPre: 'Start Logstash with the Netflow module.',
                commands: [
                  './bin/logstash --modules netflow -M netflow.var.input.udp.port={params.netflow.var.input.udp.port}'
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}
