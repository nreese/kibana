import { PARAM_TYPES } from '../../../common/tutorials/param_types';
import { INSTRUCTION_VARIANT } from '../../../common/tutorials/instruction_variant';
import { LOGSTASH_INSTRUCTIONS } from '../../../common/tutorials/logstash_instructions';

export const ON_PREM_INSTRUCTIONS = {
  params: [
    {
      id: 'netflow_var_input_udp_port',
      label: 'netflow.var.input.udp.port',
      type: PARAM_TYPES.NUMBER,
      defaultValue: 2055
    }
  ],
  instructionSets: [
    {
      title: 'Getting Started',
      instructionVariants: [
        {
          id: INSTRUCTION_VARIANT.OSX,
          instructions: [
            ...LOGSTASH_INSTRUCTIONS.INSTALL.OSX,
            {
              title: 'Set up the Netflow module',
              textPre: 'In the Logstash install directory, run the following command to set up the Netflow module.',
              commands: [
                './bin/logstash --modules netflow --setup-and-exit',
              ],
              textPost: 'The `--setup-and-exit` option creates a `netflow-*` index pattern in Elasticsearch and imports' +
                ' Kibana dashboards and visualizations. Running `--setup-and-exit` is a one-time setup step. Omit this step' +
                ' for subsequent runs of the module to avoid overwriting existing Kibana dashboards.'
            },
            {
              title: 'Start Logstash',
              commands: [
                './bin/logstash --modules netflow -M netflow.var.input.udp.port={params.netflow_var_input_udp_port}'
              ]
            }
          ]
        },
        {
          id: INSTRUCTION_VARIANT.DEB,
          instructions: [
            ...LOGSTASH_INSTRUCTIONS.INSTALL.DEB,
            {
              title: 'Set up the Netflow module',
              textPre: 'Run the following command to set up the Netflow module.',
              commands: [
                '/usr/share/logstash/bin/logstash --modules netflow --setup-and-exit',
              ],
              textPost: 'The `--setup-and-exit` option creates a `netflow-*` index pattern in Elasticsearch and imports' +
                ' Kibana dashboards and visualizations. Running `--setup-and-exit` is a one-time setup step. Omit this step' +
                ' for subsequent runs of the module to avoid overwriting existing Kibana dashboards.'
            },
            {
              title: 'Configure the Netflow module',
              textPre: 'Edit `/etc/logstash/logstash.yml` and add the following lines to it:',
              commands: [
                'modules:',
                '- name: netflow',
                '  var.input.udp.port: {params.netflow_var_input_udp_port}'
              ]
            },
            {
              title: 'Restart the Logstash service',
              commands: [
                'sudo systemctl restart logstash.service'
              ]
            }
          ]
        },
        {
          id: INSTRUCTION_VARIANT.RPM,
          instructions: [
            ...LOGSTASH_INSTRUCTIONS.INSTALL.RPM,
            {
              title: 'Set up the Netflow module',
              textPre: 'Run the following command to set up the Netflow module.',
              commands: [
                '/usr/share/logstash/bin/logstash --modules netflow --setup-and-exit',
              ],
              textPost: 'The `--setup-and-exit` option creates a `netflow-*` index pattern in Elasticsearch and imports' +
                ' Kibana dashboards and visualizations. Running `--setup-and-exit` is a one-time setup step. Omit this step' +
                ' for subsequent runs of the module to avoid overwriting existing Kibana dashboards.'
            },
            {
              title: 'Configure the Netflow module',
              textPre: 'Edit `/etc/logstash/logstash.yml` and add the following lines to it:',
              commands: [
                'modules:',
                '- name: netflow',
                '  var.input.udp.port: {params.netflow_var_input_udp_port}'
              ]
            },
            {
              title: 'Restart the Logstash service',
              commands: [
                'sudo systemctl restart logstash.service'
              ]
            }
          ]
        }
      ]
    }
  ]
};
