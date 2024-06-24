using System.Collections.Generic;
using System.Linq;
using System.Xml.Serialization;

using static Witsml.CommonConstants;

namespace Witsml.Data
{
    [XmlRoot("risks", Namespace = "http://www.witsml.org/schemas/1series")]
    public class WitsmlRisks : IWitsmlObjectList
    {
        [XmlAttribute("version")]
        public string Version = "1.4.1.1";

        [XmlElement("risk")]
        public List<WitsmlRisk> Risks { get; set; } = new List<WitsmlRisk>();

        public string TypeName => WitsmlQueryTypeName.Risk;

        [XmlIgnore]
        public IEnumerable<WitsmlObjectOnWellbore> Objects
        {
            get => Risks;
            set => Risks = value.Select(obj => (WitsmlRisk)obj).ToList();
        }
    }
}
