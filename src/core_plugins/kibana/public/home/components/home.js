import React from 'react';
import PropTypes from 'prop-types';
import { Synopsis } from './synopsis';
import {
  KuiLinkButton,
  KuiFlexGroup,
  KuiFlexItem,
  KuiFlexGrid,
  KuiCardGroup,
  KuiCard,
  KuiCardDescription,
  KuiCardDescriptionTitle,
  KuiCardDescriptionText,
  KuiCardFooter,
} from 'ui_framework/components';
import { FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';

export function Home({ addBasePath, directories }) {

  const renderDirectories = (category) => {
    return directories
    .filter((directory) => {
      return directory.showOnHomePage && directory.category === category;
    })
    .map((directory) => {
      return (
        <KuiFlexItem style={{ minHeight: 64 }} key={directory.id}>
          <Synopsis
            description={directory.description}
            iconUrl={addBasePath(directory.icon)}
            title={directory.title}
            url={addBasePath(directory.path)}
          />
        </KuiFlexItem>
      );
    });
  };

  const renderPromo = () => {
    const cardStyle = {
      width: '250px',
      'minWidth': '200px'
    };
    return (
      <div className="kuiVerticalRhythm">
        <KuiCardGroup>
          <KuiCard style={cardStyle}>
            <KuiCardDescription>
              <KuiCardDescriptionTitle>
                <img
                  src={addBasePath('/plugins/kibana/assets/app_logging.svg')}
                />
                <p>
                  Logging
                </p>
              </KuiCardDescriptionTitle>

              <KuiCardDescriptionText>
                Ingest data from popular logging platforms and get immediate dashboards.
              </KuiCardDescriptionText>
            </KuiCardDescription>

            <KuiCardFooter>
              <KuiLinkButton
                buttonType="secondary"
                href={addBasePath('/app/kibana#/home/tutorial_directory/logging')}
              >
                Select data source
              </KuiLinkButton>
            </KuiCardFooter>
          </KuiCard>

          <KuiCard style={cardStyle}>
            <KuiCardDescription>
              <KuiCardDescriptionTitle>
                <img
                  src={addBasePath('/plugins/kibana/assets/app_monitoring.svg')}
                />
                <p>
                  Metrics
                </p>
              </KuiCardDescriptionTitle>

              <KuiCardDescriptionText>
                Choose from Apache, MongoDB, Docker, MySQL, and more...
              </KuiCardDescriptionText>
            </KuiCardDescription>

            <KuiCardFooter>
              <KuiLinkButton
                buttonType="secondary"
                href={addBasePath('/app/kibana#/home/tutorial_directory/metrics')}
              >
                Select data source
              </KuiLinkButton>
            </KuiCardFooter>
          </KuiCard>

          <KuiCard style={cardStyle}>
            <KuiCardDescription>
              <KuiCardDescriptionTitle>
                <img
                  src={addBasePath('/plugins/kibana/assets/app_security.svg')}
                />
                <p>
                  Security analytics
                </p>
              </KuiCardDescriptionTitle>

              <KuiCardDescriptionText>
                Ingest data from popular security solutions and get immediately insights.
              </KuiCardDescriptionText>
            </KuiCardDescription>

            <KuiCardFooter>
              <KuiLinkButton
                buttonType="secondary"
                href={addBasePath('/app/kibana#/home/tutorial_directory/security')}
              >
                Select data source
              </KuiLinkButton>
            </KuiCardFooter>
          </KuiCard>
        </KuiCardGroup>
      </div>
    );
  };

  return (
    <div className="kuiView home">
      <div className="kuiViewContent">

        <div className="kuiViewContentItem kuiVerticalRhythmXLarge">
          <KuiFlexGroup
            className="kuiVerticalRhythmSmall"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
          >
            <KuiFlexItem>
              <h1 className="kuiTitle">
                Add data
              </h1>
            </KuiFlexItem>

            <KuiFlexItem grow={false}>
              <KuiFlexGroup alignItems="center">
                <KuiFlexItem grow={false}>
                  <p className="kuiText kuiSubduedText">
                    Data already in Elasticsearch?
                  </p>
                </KuiFlexItem>

                <KuiFlexItem grow={false}>
                  <KuiLinkButton
                    buttonType="secondary"
                    href={addBasePath('/app/kibana#/management/kibana/index')}
                  >
                    Set up index patterns
                  </KuiLinkButton>
                </KuiFlexItem>
              </KuiFlexGroup>

            </KuiFlexItem>
          </KuiFlexGroup>

          <p className="kuiText kuiSubduedText kuiVerticalRhythm kuiVerticalRhythmSmall">
            These turn-key solutions will help you quickly add data into Kibana and turn it into
            pre-built dashboards / monitoring systems.
          </p>

          { renderPromo() }
        </div>

        <div className="kuiViewContentItem kuiVerticalRhythmXLarge">
          <KuiFlexGroup className="kuiVerticalRhythm">
            <KuiFlexItem className="kuiPanel homePanel">
              <h3 className="kuiSubTitle kuiVerticalRhythm">
                Visualize and explore data
              </h3>
              <KuiFlexGrid className="kuiVerticalRhythmSmall homeTopFeatures" columns={2}>
                { renderDirectories(FeatureCatalogueCategory.DATA) }
              </KuiFlexGrid>
            </KuiFlexItem>
            <KuiFlexItem className="kuiPanel homePanel">
              <h3 className="kuiSubTitle kuiVerticalRhythm">
                Manage and administer the Elastic stack
              </h3>
              <KuiFlexGrid className="kuiVerticalRhythmSmall homeTopFeatures" columns={2}>
                { renderDirectories(FeatureCatalogueCategory.ADMIN) }
              </KuiFlexGrid>
            </KuiFlexItem>
          </KuiFlexGroup>
        </div>

        <div className="kuiViewContentItem kuiVerticalRhythmXLarge text-center">
          <h4 className="kuiSubduedText kuiVerticalRhythmSmall">
            {`Didn't find what you were looking for?`}
          </h4>
          <KuiLinkButton
            buttonType="secondary"
            href="#/home/feature_directory"
          >
            View full directory of Kibana features
          </KuiLinkButton>
        </div>

      </div>
    </div>
  );
}

Home.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  directories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    showOnHomePage: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired
  }))
};
